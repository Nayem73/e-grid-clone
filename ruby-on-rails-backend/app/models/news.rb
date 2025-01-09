class News < ApplicationRecord
  has_many :news_translations, dependent: :destroy
  accepts_nested_attributes_for :news_translations, update_only: true, allow_destroy: true
  
  validates :slug, uniqueness: true
end
