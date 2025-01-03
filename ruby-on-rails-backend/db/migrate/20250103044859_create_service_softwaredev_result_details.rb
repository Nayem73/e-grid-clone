class CreateServiceSoftwaredevResultDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :service_softwaredev_result_details do |t|
      t.references :service_softwaredev_result, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :system_name
      t.string :language
      t.text :scope

      t.timestamps
    end
  end
end
