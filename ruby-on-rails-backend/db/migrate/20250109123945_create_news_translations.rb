class CreateNewsTranslations < ActiveRecord::Migration[8.0]
  def change
    create_table :news_translations do |t|
      t.references :news, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :title
      t.text :description
      t.string :image_url

      t.timestamps
    end

    add_index :news_translations, [:news_id, :locale], unique: true
  end
end
