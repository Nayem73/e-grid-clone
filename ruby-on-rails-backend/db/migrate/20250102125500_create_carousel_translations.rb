class CreateCarouselTranslations < ActiveRecord::Migration[8.0]
  def change
    create_table :carousel_translations do |t|
      t.string :locale, null: false, default: 'en'
      t.string :title, null: false
      t.text :description, null: false

      t.timestamps
    end
  end
end
