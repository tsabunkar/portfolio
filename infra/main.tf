// S3 Bucket (Private)
resource "aws_s3_bucket" "portfolio" {
  bucket = var.domain_name
}

resource "aws_s3_bucket_public_access_block" "block" {
  bucket                  = aws_s3_bucket.portfolio.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

// CloudFront Origin Access Control (OAC)
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "portfolio-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

// ACM Certificate (us-east-1)
resource "aws_acm_certificate" "cert" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    var.www_domain
  ]

  lifecycle {
    create_before_destroy = true
  }
}


// Route53 DNS Validation
resource "aws_route53_zone" "zone" {
  name = var.domain_name
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options :
    dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.zone.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "cert_validation_complete" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

// CloudFront Function to redirect www to root domain 
resource "aws_cloudfront_function" "redirect_www_to_root" {
  name    = "redirect-www-to-root"
  runtime = "cloudfront-js-1.0"
  publish = true

  code = <<EOF
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;

  if (host.startsWith("www.")) {
    var newUrl = "https://" + host.replace("www.", "") + request.uri;
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: {
        "location": { "value": newUrl }
      }
    };
  }

  return request;
}
EOF
}

// CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"
  aliases             = [var.domain_name, var.www_domain]

  origin {
    domain_name              = aws_s3_bucket.portfolio.bucket_regional_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-origin"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect_www_to_root.arn
    }
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 300
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.cert_validation_complete.certificate_arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  depends_on = [aws_acm_certificate_validation.cert_validation_complete]
}


// S3 Bucket Policy (Allow CloudFront Only)
resource "aws_s3_bucket_policy" "policy" {
  bucket = aws_s3_bucket.portfolio.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.portfolio.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}

// Route53 Alias Record → CloudFront
resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = var.www_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

// Terraform to upload static files

// =============================
// Build React App Automatically
// =============================
resource "null_resource" "build_react" {
  provisioner "local-exec" {
    command = "cd .. && npm install && npm run build"
  }

  triggers = {
    always_run = timestamp()
  }
}

// =============================
// Upload React dist/ to S3
// =============================
locals {
  dist_path = "${path.module}/../dist"
}

resource "aws_s3_object" "react_files" {
  for_each = fileset(local.dist_path, "**")

  bucket = aws_s3_bucket.portfolio.id
  key    = each.value
  source = "${local.dist_path}/${each.value}"
  etag   = filemd5("${local.dist_path}/${each.value}")

  content_type = lookup(
    {
      html = "text/html"
      js   = "application/javascript"
      css  = "text/css"
      json = "application/json"
      png  = "image/png"
      jpg  = "image/jpeg"
      jpeg = "image/jpeg"
      svg  = "image/svg+xml"
      ico  = "image/x-icon"
      webp = "image/webp"
    },
    split(".", each.value)[length(split(".", each.value)) - 1],
    "application/octet-stream"
  )

  depends_on = [null_resource.build_react]
}

// =============================
// CloudFront Cache Invalidation
// =============================
resource "null_resource" "invalidate_cache" {
  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.cdn.id} --paths '/*'"
  }

  triggers = {
    deployment = timestamp()
  }

  depends_on = [aws_s3_object.react_files]
}