output "cloudfront_url" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "admin_api_url" {
  value       = aws_apigatewayv2_api.admin.api_endpoint
  description = "Admin API Gateway endpoint — set as VITE_API_URL in frontend build"
}