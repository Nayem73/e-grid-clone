class CreatePressTranslations < ActiveRecord::Migration[8.0]
  def change
    create_table :press_translations do |t|
      t.references :press, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :title
      t.text :description
      t.string :image_url

      t.timestamps
    end

    add_index :press_translations, [:press_id, :locale], unique: true
  end
end
