class Press < ApplicationRecord
  has_many :press_translations, dependent: :destroy
  accepts_nested_attributes_for :press_translations, update_only: true, allow_destroy: true
  
  validates :slug, uniqueness: true
end
