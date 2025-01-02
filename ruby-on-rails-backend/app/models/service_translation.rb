class ServiceTranslation < ApplicationRecord
  belongs_to :service

  validates :locale, presence: true
  validates :title, presence: true
  validates :description, presence: true
  validates :image_url, presence: true
end
