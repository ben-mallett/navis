provider "google" {
    project = var.project_id
    region  = var.region
}

# Spins up a PostgreSQL DB
resource "google_sql_database_instance" "pontus_db_tf" {
  name             = var.db_name
  database_version = "POSTGRES_12"
  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_database" "pontus_db_tf" {
  name     = var.db_name
  instance = google_sql_database_instance.pontus_db_tf.name
}