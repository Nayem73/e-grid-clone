class CreateWebresultCategoryDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :webresult_category_details do |t|
      t.string :locale
      t.string :company_name
      t.string :service_name
      t.text :details
      t.string :image_url
      t.string :slug
      t.references :webresult_category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
