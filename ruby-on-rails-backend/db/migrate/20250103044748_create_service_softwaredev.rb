class CreateServiceSoftwaredev < ActiveRecord::Migration[8.0]
  def change
    create_table :service_softwaredevs do |t|
      t.string :locale, null: false
      t.text :description
      t.text :main_dev_language_1
      t.text :main_dev_language_2
      t.string :image_url
      t.text :others
      t.text :contact_form

      t.timestamps
    end
  end
end
