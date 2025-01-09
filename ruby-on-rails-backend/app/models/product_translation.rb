class ProductTranslation < ApplicationRecord
  belongs_to :product

  validates :locale, presence: true
  validates :title, presence: true
  validates :description, presence: true
  validates :image_url, presence: true
end
