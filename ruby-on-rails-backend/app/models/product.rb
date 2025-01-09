class Product < ApplicationRecord
  has_many :product_translations, dependent: :destroy
  accepts_nested_attributes_for :product_translations, update_only: true, allow_destroy: true
  
  validates :slug, uniqueness: true
end
