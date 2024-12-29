class CreateComponentMedia < ActiveRecord::Migration[8.0]
  def change
    create_table :component_media do |t|
      t.references :page_component, null: false, foreign_key: { to_table: :page_components }
      t.references :media, null: false, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end
