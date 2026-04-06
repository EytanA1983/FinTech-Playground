terraform {
  required_version = ">= 1.8.0"
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

# Stack for Banking‑X
locals {
  stack_name = "banking-x"
}

module "app-deployment" {
  source = "terraform-aws-modules/k8s-deployment/aws"

  cluster_name = "mycluster"
  namespace   = local.stack_name

  # Docker image built from compose
  image_name = "banking-x-api:latest"
  container_name = "banking-api"
  container_port = 3000

  environment_variables = {
    DB_HOST          = "postgresql"
    DB_PORT          = "5432"
    DB_USER          = "postgres"
    DB_PASS          = "postgres"
    DB_NAME          = "bankingx"
    REDIS_HOST       = "redis"
    REDIS_PORT       = "6379"
    JWT_SECRET       = "my_super_secret"
  }

  # Service definition for API
  service = {
    name = "banking-api"
    port = 3000
  }
}

