class CreateProductTranslations < ActiveRecord::Migration[8.0]
  def change
    create_table :product_translations do |t|
      t.references :product, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :title
      t.text :description
      t.string :image_url

      t.timestamps
    end

    add_index :product_translations, [:product_id, :locale], unique: true
  end
end
