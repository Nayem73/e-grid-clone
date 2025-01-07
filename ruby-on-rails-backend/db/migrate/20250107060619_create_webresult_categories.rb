class CreateWebresultCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :webresult_categories do |t|
      t.string :category_name_en
      t.string :category_name_jp

      t.timestamps
    end
  end
end
