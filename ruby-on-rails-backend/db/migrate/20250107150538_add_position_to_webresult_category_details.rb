class AddPositionToWebresultCategoryDetails < ActiveRecord::Migration[8.0]
  def change
    add_column :webresult_category_details, :position, :integer
    add_index :webresult_category_details, :position
  end
end
