class Service < ApplicationRecord
  has_many :service_translations, dependent: :destroy
  accepts_nested_attributes_for :service_translations
  
  validates :slug, uniqueness: true
end
