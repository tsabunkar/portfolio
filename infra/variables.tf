variable "aws_region" {
  default = "us-east-1"
}

variable "domain_name" {
  description = "Root domain name"
}

variable "www_domain" {
  description = "WWW domain"
}

variable "github_username" {
  description = "GitHub username for contribution graph"
  type        = string
  default     = "tsabunkar"
}