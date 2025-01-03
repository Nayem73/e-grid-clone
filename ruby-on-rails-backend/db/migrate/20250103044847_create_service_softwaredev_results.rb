class CreateServiceSoftwaredevResults < ActiveRecord::Migration[8.0]
  def change
    create_table :service_softwaredev_results do |t|
      t.timestamps
    end
  end
end
