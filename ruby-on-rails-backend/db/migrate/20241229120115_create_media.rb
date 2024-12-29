class CreateMedia < ActiveRecord::Migration[8.0]
  def change
    create_table :media do |t|
      t.string :file_name
      t.string :file_type
      t.string :file_path
      t.string :alt_text

      t.timestamps
    end
  end
end
