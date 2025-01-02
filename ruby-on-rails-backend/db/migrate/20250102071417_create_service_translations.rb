class CreateServiceTranslations < ActiveRecord::Migration[8.0]
  def change
    create_table :service_translations do |t|
      t.references :service, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :title
      t.text :description

      t.timestamps
    end

    add_index :service_translations, [:service_id, :locale], unique: true
  end
end
