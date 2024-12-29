class CreatePages < ActiveRecord::Migration[8.0]
  def change
    create_table :pages do |t|
      t.string :slug
      t.string :template_type
      t.string :title
      t.text :meta_description
      t.text :meta_keywords
      t.string :status

      t.timestamps
    end
  end
end
