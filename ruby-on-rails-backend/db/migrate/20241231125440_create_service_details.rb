class CreateServiceDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :service_details do |t|
      t.bigint :service_id
      t.text :content
      t.string :additional_image_url

      t.timestamps
    end

    add_foreign_key :service_details, :services, column: :service_id
  end
end