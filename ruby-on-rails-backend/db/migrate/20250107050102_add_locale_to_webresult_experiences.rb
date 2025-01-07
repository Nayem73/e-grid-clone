class AddLocaleToWebresultExperiences < ActiveRecord::Migration[8.0]
  def change
    add_column :webresult_experiences, :locale, :string
  end
end
