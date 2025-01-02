class Service < ApplicationRecord
  has_many :service_translations, dependent: :destroy
  accepts_nested_attributes_for :service_translations, update_only: true, allow_destroy: true
  
  validates :slug, uniqueness: true
end
