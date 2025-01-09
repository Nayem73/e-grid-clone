class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :slug

      t.timestamps
    end
    add_index :products, :slug, unique: true
  end
end
