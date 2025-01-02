class CreateCarouselImages < ActiveRecord::Migration[8.0]
  def change
    create_table :carousel_images do |t|
      t.string :image_url, null: false

      t.timestamps
    end
  end
end
