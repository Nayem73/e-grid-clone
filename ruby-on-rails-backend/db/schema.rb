# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_01_09_161241) do
  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "carousel_images", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "image_url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "carousel_translations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "locale", default: "en", null: false
    t.string "title", null: false
    t.text "description", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "news", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_news_on_slug", unique: true
  end

  create_table "news_translations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "news_id", null: false
    t.string "locale", null: false
    t.string "title"
    t.text "description"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["news_id", "locale"], name: "index_news_translations_on_news_id_and_locale", unique: true
    t.index ["news_id"], name: "index_news_translations_on_news_id"
  end

  create_table "press_translations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "press_id", null: false
    t.string "locale", null: false
    t.string "title"
    t.text "description"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["press_id", "locale"], name: "index_press_translations_on_press_id_and_locale", unique: true
    t.index ["press_id"], name: "index_press_translations_on_press_id"
  end

  create_table "presses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_presses_on_slug", unique: true
  end

  create_table "product_translations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "locale", null: false
    t.string "title"
    t.text "description"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "locale"], name: "index_product_translations_on_product_id_and_locale", unique: true
    t.index ["product_id"], name: "index_product_translations_on_product_id"
  end

  create_table "products", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_products_on_slug", unique: true
  end

  create_table "service_softwaredev_result_details", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "service_softwaredev_result_id", null: false
    t.string "locale", null: false
    t.string "system_name"
    t.string "language"
    t.text "scope"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["service_softwaredev_result_id"], name: "idx_on_service_softwaredev_result_id_0c4aa8c832"
  end

  create_table "service_softwaredev_results", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "service_softwaredevs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "locale", null: false
    t.text "description"
    t.text "main_dev_language_1"
    t.text "main_dev_language_2"
    t.string "image_url"
    t.text "others"
    t.text "contact_form"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "service_translations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "service_id", null: false
    t.string "locale", null: false
    t.string "title"
    t.text "description"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["service_id", "locale"], name: "index_service_translations_on_service_id_and_locale", unique: true
    t.index ["service_id"], name: "index_service_translations_on_service_id"
  end

  create_table "services", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_services_on_slug", unique: true
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "webresult_categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "category_name_en"
    t.string "category_name_jp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position"
    t.index ["position"], name: "index_webresult_categories_on_position"
  end

  create_table "webresult_category_details", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "locale"
    t.string "company_name"
    t.string "service_name"
    t.text "details"
    t.string "image_url"
    t.string "slug"
    t.bigint "webresult_category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["webresult_category_id"], name: "index_webresult_category_details_on_webresult_category_id"
  end

  create_table "webresult_category_titles", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title_en"
    t.string "title_jp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "webresult_experiences", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.text "description"
    t.string "marketing_title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "locale"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "news_translations", "news"
  add_foreign_key "press_translations", "presses"
  add_foreign_key "product_translations", "products"
  add_foreign_key "service_softwaredev_result_details", "service_softwaredev_results"
  add_foreign_key "service_translations", "services"
  add_foreign_key "webresult_category_details", "webresult_categories"
end
