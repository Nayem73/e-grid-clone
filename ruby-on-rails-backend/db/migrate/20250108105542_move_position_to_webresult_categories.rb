# db/migrate/[timestamp]_move_position_to_webresult_categories.rb
class MovePositionToWebresultCategories < ActiveRecord::Migration[7.0]
  def change
    # Add position to webresult_categories
    add_column :webresult_categories, :position, :integer
    add_index :webresult_categories, :position
    
    # Copy positions from details to categories
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE webresult_categories wc
          SET position = (
            SELECT position 
            FROM webresult_category_details wcd 
            WHERE wcd.webresult_category_id = wc.id 
            AND wcd.locale = 'en' 
            LIMIT 1
          )
        SQL
      end
    end
    
    # Remove position from webresult_category_details
    remove_column :webresult_category_details, :position, :integer
  end
end