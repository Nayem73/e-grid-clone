class CreateServices < ActiveRecord::Migration[8.0]
  def change
    create_table :services do |t|
      t.string :title
      t.text :description
      t.string :image_url
      t.string :slug

      t.timestamps
    end

    add_index :services, :slug, unique: true
  end
end
