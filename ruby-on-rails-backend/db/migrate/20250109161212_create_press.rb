class CreatePress < ActiveRecord::Migration[8.0]
  def change
    create_table :presses do |t|
      t.string :slug

      t.timestamps
    end
    add_index :presses, :slug, unique: true
  end
end
