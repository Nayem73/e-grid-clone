class CreateWebresultCategoryTitles < ActiveRecord::Migration[8.0]
  def change
    create_table :webresult_category_titles do |t|
      t.string :title_en
      t.string :title_jp

      t.timestamps
    end
  end
end
