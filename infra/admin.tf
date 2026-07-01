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

// =============================
// Lambda Functions
// =============================

locals {
  lambda_zip_dir = "${path.module}/lambda"
}

resource "aws_lambda_function" "admin_login" {
  filename         = "${local.lambda_zip_dir}/login.zip"
  function_name    = "admin-login"
  role             = aws_iam_role.admin_login.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = filebase64sha256("${local.lambda_zip_dir}/login.zip")
  depends_on       = [aws_cloudwatch_log_group.admin_login, null_resource.build_lambda]
}

resource "aws_lambda_function" "admin_authorizer" {
  filename         = "${local.lambda_zip_dir}/authorizer.zip"
  function_name    = "admin-authorizer"
  role             = aws_iam_role.admin_authorizer.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = filebase64sha256("${local.lambda_zip_dir}/authorizer.zip")
  depends_on       = [aws_cloudwatch_log_group.admin_authorizer, null_resource.build_lambda]
}

resource "aws_lambda_function" "admin_cost_explorer" {
  filename         = "${local.lambda_zip_dir}/costExplorer.zip"
  function_name    = "admin-cost-explorer"
  role             = aws_iam_role.admin_cost_explorer.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = filebase64sha256("${local.lambda_zip_dir}/costExplorer.zip")
  depends_on       = [aws_cloudwatch_log_group.admin_cost_explorer, null_resource.build_lambda]
}

resource "aws_lambda_function" "admin_github" {
  filename         = "${local.lambda_zip_dir}/githubContributions.zip"
  function_name    = "admin-github-contributions"
  role             = aws_iam_role.admin_github.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  source_code_hash = filebase64sha256("${local.lambda_zip_dir}/githubContributions.zip")
  environment {
    variables = {
      GITHUB_USERNAME = var.github_username
    }
  }
  depends_on = [aws_cloudwatch_log_group.admin_github, null_resource.build_lambda]
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

resource "aws_lambda_permission" "admin_authorizer" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = aws_apigatewayv2_api.admin.execution_arn
}

// =============================
// Build Lambda Zips (local-exec)
// =============================

resource "null_resource" "build_lambda" {
  provisioner "local-exec" {
    command     = "cd lambda && make all"
    working_dir = path.module
  }
  triggers = {
    go_files = join(",", fileset("${path.module}/lambda", "**/*.go"))
  }
}
