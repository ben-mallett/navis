variable "db_name" {
  description = "Database Name"
  type        = string
}

variable "db_password" {
  description = "Database Password"
  type        = string
}

variable "db_user" {
  description = "Database Username"
  type        = string
}

variable "session_key" {
  description = "Session Key for login hashing"
  type        = string
}

variable "admin_email" {
    description = "Admin Email for permissioned login"
    type        = string
}

variable "project_id" {
    description = "Project ID for Google Project"
    type        = string
}

variable "region" {
    description = "Region of Google Project"
    type        = string
}

variable "ar_hostname" {
  description = "Artifact Registry hostname"
  type        = string
  default     = "us-east1-docker.pkg.dev" 
}

variable "repo_name" {
  description = "Repository name"
  type        = string
  default     = "pontus"
}

variable "service_name" {
  description = "Service name"
  type        = string
  default     = "pontus"
}

variable "commit_sha" {
  description = "Commit SHA for tagging the image"
  type        = string
}