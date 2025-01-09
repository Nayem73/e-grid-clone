class CreateNews < ActiveRecord::Migration[8.0]
  def change
    create_table :news do |t|
      t.string :slug

      t.timestamps
    end
    add_index :news, :slug, unique: true
  end
end
