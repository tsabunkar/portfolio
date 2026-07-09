// =============================
// Admin Feature — Secrets Manager
// =============================

resource "random_password" "jwt_secret" {
  length  = 64
  special = false
}

// SSM Parameter Store — keys created by Terraform, values set via Console
resource "aws_ssm_parameter" "admin_username" {
  name  = "/admin/username"
  type  = "SecureString"
  value = "pending"

  lifecycle { ignore_changes = [value] }
}

resource "aws_ssm_parameter" "admin_password" {
  name  = "/admin/password"
  type  = "SecureString"
  value = "pending"

  lifecycle { ignore_changes = [value] }
}

resource "aws_ssm_parameter" "admin_github_token" {
  name  = "/admin/github-token"
  type  = "SecureString"
  value = "pending"

  lifecycle { ignore_changes = [value] }
}

data "aws_ssm_parameter" "admin_username" {
  name       = "/admin/username"
  depends_on = [aws_ssm_parameter.admin_username]
}

data "aws_ssm_parameter" "admin_password" {
  name       = "/admin/password"
  depends_on = [aws_ssm_parameter.admin_password]
}

data "aws_ssm_parameter" "admin_github_token" {
  name       = "/admin/github-token"
  depends_on = [aws_ssm_parameter.admin_github_token]
}

resource "aws_secretsmanager_secret" "admin_credentials" {
  name = "/admin/credentials"
}

resource "aws_secretsmanager_secret_version" "admin_credentials" {
  secret_id = aws_secretsmanager_secret.admin_credentials.id
  secret_string = jsonencode({
    username = data.aws_ssm_parameter.admin_username.value
    password = data.aws_ssm_parameter.admin_password.value
  })
}

resource "aws_secretsmanager_secret" "admin_jwt_secret" {
  name = "/admin/jwt-secret"
}

resource "aws_secretsmanager_secret" "admin_totp_secret" {
  name = "/admin/totp-secret"
}

resource "aws_secretsmanager_secret_version" "admin_jwt_secret" {
  secret_id = aws_secretsmanager_secret.admin_jwt_secret.id
  secret_string = jsonencode({
    secret = random_password.jwt_secret.result
  })
}

resource "aws_secretsmanager_secret" "admin_github_token" {
  name = "/admin/github-token"
}

resource "aws_secretsmanager_secret_version" "admin_github_token" {
  secret_id = aws_secretsmanager_secret.admin_github_token.id
  secret_string = jsonencode({
    token = data.aws_ssm_parameter.admin_github_token.value
  })
}

resource "aws_ssm_parameter" "admin_youtube_api_key" {
  name   = "/admin/youtube-api-key"
  type   = "SecureString"
  value  = "pending"

  lifecycle { ignore_changes = [value] }
}

data "aws_ssm_parameter" "admin_youtube_api_key" {
  name       = "/admin/youtube-api-key"
  depends_on = [aws_ssm_parameter.admin_youtube_api_key]
}

resource "aws_secretsmanager_secret" "admin_youtube_api_key" {
  name = "/admin/youtube-api-key"
}

resource "aws_secretsmanager_secret_version" "admin_youtube_api_key" {
  secret_id = aws_secretsmanager_secret.admin_youtube_api_key.id
  secret_string = jsonencode({
    api_key = data.aws_ssm_parameter.admin_youtube_api_key.value
  })
}


// =============================
// IAM Roles for Lambda Functions
// =============================

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "login_lambda" {
  statement {
    actions = ["secretsmanager:GetSecretValue"]
    resources = [
      aws_secretsmanager_secret.admin_credentials.arn,
      aws_secretsmanager_secret.admin_jwt_secret.arn,
      aws_secretsmanager_secret.admin_totp_secret.arn,
    ]
  }
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

data "aws_iam_policy_document" "authorizer_lambda" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.admin_jwt_secret.arn]
  }
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

data "aws_iam_policy_document" "cost_explorer_lambda" {
  statement {
    actions   = ["ce:GetCostAndUsage"]
    resources = ["*"]
  }
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

data "aws_iam_policy_document" "github_lambda" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.admin_github_token.arn]
  }
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_role" "admin_login" {
  name               = "admin-login-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "admin_login" {
  role   = aws_iam_role.admin_login.name
  policy = data.aws_iam_policy_document.login_lambda.json
}

resource "aws_iam_role" "admin_authorizer" {
  name               = "admin-authorizer-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "admin_authorizer" {
  role   = aws_iam_role.admin_authorizer.name
  policy = data.aws_iam_policy_document.authorizer_lambda.json
}

resource "aws_iam_role" "admin_cost_explorer" {
  name               = "admin-cost-explorer-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "admin_cost_explorer" {
  role   = aws_iam_role.admin_cost_explorer.name
  policy = data.aws_iam_policy_document.cost_explorer_lambda.json
}

resource "aws_iam_role" "admin_github" {
  name               = "admin-github-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "admin_github" {
  role   = aws_iam_role.admin_github.name
  policy = data.aws_iam_policy_document.github_lambda.json
}

data "aws_iam_policy_document" "youtube_lambda" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.admin_youtube_api_key.arn]
  }
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_role" "admin_youtube" {
  name               = "admin-youtube-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "admin_youtube" {
  role   = aws_iam_role.admin_youtube.name
  policy = data.aws_iam_policy_document.youtube_lambda.json
}

data "aws_iam_policy_document" "setup_totp_lambda" {
  statement {
    actions   = ["secretsmanager:GetSecretValue", "secretsmanager:PutSecretValue"]
    resources = [aws_secretsmanager_secret.admin_totp_secret.arn]
  }
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_role" "admin_setup_totp" {
  name               = "admin-setup-totp-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "admin_setup_totp" {
  role   = aws_iam_role.admin_setup_totp.name
  policy = data.aws_iam_policy_document.setup_totp_lambda.json
}


// =============================
// CloudWatch Log Groups
// =============================

resource "aws_cloudwatch_log_group" "admin_login" {
  name              = "/aws/lambda/admin-login"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "admin_authorizer" {
  name              = "/aws/lambda/admin-authorizer"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "admin_cost_explorer" {
  name              = "/aws/lambda/admin-cost-explorer"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "admin_github" {
  name              = "/aws/lambda/admin-github-contributions"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "admin_youtube" {
  name              = "/aws/lambda/admin-youtube-metrics"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "admin_setup_totp" {
  name              = "/aws/lambda/admin-setup-totp"
  retention_in_days = 14
}


// =============================
// Lambda Functions
// =============================

data "archive_file" "login" {
  type        = "zip"
  source_file = "${path.module}/lambda/bin/login/bootstrap"
  output_path = "${path.module}/lambda/login.zip"
}

data "archive_file" "authorizer" {
  type        = "zip"
  source_file = "${path.module}/lambda/bin/authorizer/bootstrap"
  output_path = "${path.module}/lambda/authorizer.zip"
}

data "archive_file" "cost_explorer" {
  type        = "zip"
  source_file = "${path.module}/lambda/bin/costExplorer/bootstrap"
  output_path = "${path.module}/lambda/costExplorer.zip"
}

data "archive_file" "github" {
  type        = "zip"
  source_file = "${path.module}/lambda/bin/githubContributions/bootstrap"
  output_path = "${path.module}/lambda/githubContributions.zip"
}

data "archive_file" "youtube" {
  type        = "zip"
  source_file = "${path.module}/lambda/bin/youtubeMetrics/bootstrap"
  output_path = "${path.module}/lambda/youtubeMetrics.zip"
}

data "archive_file" "setup_totp" {
  type        = "zip"
  source_file = "${path.module}/lambda/bin/setup-totp/bootstrap"
  output_path = "${path.module}/lambda/setup-totp.zip"
}

resource "aws_lambda_function" "admin_login" {
  filename         = data.archive_file.login.output_path
  function_name    = "admin-login"
  role             = aws_iam_role.admin_login.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = data.archive_file.login.output_base64sha256
  depends_on       = [aws_cloudwatch_log_group.admin_login]
}

resource "aws_lambda_function" "admin_authorizer" {
  filename         = data.archive_file.authorizer.output_path
  function_name    = "admin-authorizer"
  role             = aws_iam_role.admin_authorizer.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = data.archive_file.authorizer.output_base64sha256
  depends_on       = [aws_cloudwatch_log_group.admin_authorizer]
}

resource "aws_lambda_function" "admin_cost_explorer" {
  filename         = data.archive_file.cost_explorer.output_path
  function_name    = "admin-cost-explorer"
  role             = aws_iam_role.admin_cost_explorer.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = data.archive_file.cost_explorer.output_base64sha256
  depends_on       = [aws_cloudwatch_log_group.admin_cost_explorer]
}

resource "aws_lambda_function" "admin_github" {
  filename         = data.archive_file.github.output_path
  function_name    = "admin-github-contributions"
  role             = aws_iam_role.admin_github.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = data.archive_file.github.output_base64sha256
  environment {
    variables = {
      GITHUB_USERNAME = var.github_username
    }
  }
  depends_on = [aws_cloudwatch_log_group.admin_github]
}

resource "aws_lambda_function" "admin_youtube" {
  filename         = data.archive_file.youtube.output_path
  function_name    = "admin-youtube-metrics"
  role             = aws_iam_role.admin_youtube.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = data.archive_file.youtube.output_base64sha256
  environment {
    variables = {
      YOUTUBE_HANDLE = "@tsabunkar"
    }
  }
  depends_on = [aws_cloudwatch_log_group.admin_youtube]
}

resource "aws_lambda_function" "admin_setup_totp" {
  filename         = data.archive_file.setup_totp.output_path
  function_name    = "admin-setup-totp"
  role             = aws_iam_role.admin_setup_totp.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = data.archive_file.setup_totp.output_base64sha256
  depends_on       = [aws_cloudwatch_log_group.admin_setup_totp]
}


// =============================
// API Gateway (HTTP API v2)
// =============================

resource "aws_apigatewayv2_api" "admin" {
  name          = "admin-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["https://${var.domain_name}"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Authorization", "Content-Type"]
    max_age       = 300
  }
}

// --- Lambda Authorizer ---

resource "aws_apigatewayv2_authorizer" "admin" {
  api_id                            = aws_apigatewayv2_api.admin.id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.admin_authorizer.invoke_arn
  identity_sources                  = ["$request.header.Authorization"]
  name                              = "jwt-authorizer"
  authorizer_payload_format_version = "1.0"
}

// --- Integrations ---

resource "aws_apigatewayv2_integration" "admin_login" {
  api_id                 = aws_apigatewayv2_api.admin.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin_login.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "admin_cost_explorer" {
  api_id                 = aws_apigatewayv2_api.admin.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin_cost_explorer.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "admin_github" {
  api_id                 = aws_apigatewayv2_api.admin.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin_github.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "admin_youtube" {
  api_id                 = aws_apigatewayv2_api.admin.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin_youtube.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "admin_setup_totp" {
  api_id                 = aws_apigatewayv2_api.admin.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin_setup_totp.invoke_arn
  payload_format_version = "2.0"
}


// --- Routes ---

resource "aws_apigatewayv2_route" "admin_login" {
  api_id    = aws_apigatewayv2_api.admin.id
  route_key = "POST /login"
  target    = "integrations/${aws_apigatewayv2_integration.admin_login.id}"
}

resource "aws_apigatewayv2_route" "admin_cost_explorer" {
  api_id        = aws_apigatewayv2_api.admin.id
  route_key     = "GET /cost-explorer"
  target        = "integrations/${aws_apigatewayv2_integration.admin_cost_explorer.id}"
  authorizer_id = aws_apigatewayv2_authorizer.admin.id
}

resource "aws_apigatewayv2_route" "admin_github" {
  api_id        = aws_apigatewayv2_api.admin.id
  route_key     = "GET /github-contributions"
  target        = "integrations/${aws_apigatewayv2_integration.admin_github.id}"
  authorizer_id = aws_apigatewayv2_authorizer.admin.id
}

resource "aws_apigatewayv2_route" "admin_youtube" {
  api_id        = aws_apigatewayv2_api.admin.id
  route_key     = "GET /youtube-metrics"
  target        = "integrations/${aws_apigatewayv2_integration.admin_youtube.id}"
  authorizer_id = aws_apigatewayv2_authorizer.admin.id
}

resource "aws_apigatewayv2_route" "admin_setup_totp_get" {
  api_id        = aws_apigatewayv2_api.admin.id
  route_key     = "GET /setup-totp"
  target        = "integrations/${aws_apigatewayv2_integration.admin_setup_totp.id}"
  authorizer_id = aws_apigatewayv2_authorizer.admin.id
}

resource "aws_apigatewayv2_route" "admin_setup_totp_post" {
  api_id        = aws_apigatewayv2_api.admin.id
  route_key     = "POST /setup-totp"
  target        = "integrations/${aws_apigatewayv2_integration.admin_setup_totp.id}"
  authorizer_id = aws_apigatewayv2_authorizer.admin.id
}


// --- Stage ---

resource "aws_apigatewayv2_stage" "admin" {
  api_id      = aws_apigatewayv2_api.admin.id
  name        = "$default"
  auto_deploy = true
}

// --- Lambda Permissions (allow API Gateway to invoke) ---

resource "aws_lambda_permission" "admin_login" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_login.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.admin.execution_arn}/*/*/login"
}

resource "aws_lambda_permission" "admin_cost_explorer" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_cost_explorer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.admin.execution_arn}/*/*/cost-explorer"
}

resource "aws_lambda_permission" "admin_github" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_github.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.admin.execution_arn}/*/*/github-contributions"
}

resource "aws_lambda_permission" "admin_youtube" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_youtube.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.admin.execution_arn}/*/*/youtube-metrics"
}

resource "aws_lambda_permission" "admin_setup_totp" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_setup_totp.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.admin.execution_arn}/*/*/setup-totp"
}


resource "aws_lambda_permission" "admin_authorizer" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = aws_apigatewayv2_api.admin.execution_arn
}


