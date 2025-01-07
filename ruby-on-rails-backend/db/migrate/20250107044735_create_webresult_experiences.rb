class CreateWebresultExperiences < ActiveRecord::Migration[8.0]
  def change
    create_table :webresult_experiences do |t|
      t.text :description
      t.string :marketing_title

      t.timestamps
    end
  end
end
