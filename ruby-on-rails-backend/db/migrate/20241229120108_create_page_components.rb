class CreatePageComponents < ActiveRecord::Migration[8.0]
  def change
    create_table :page_components do |t|
      t.references :page, null: false, foreign_key: true
      t.string :component_type
      t.integer :position
      t.json :content
      t.json :style_settings

      t.timestamps
    end
  end
end
