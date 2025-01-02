class CarouselTranslation < ApplicationRecord
  validates :locale, presence: true
  validates :title, presence: true
  validates :description, presence: true
end
