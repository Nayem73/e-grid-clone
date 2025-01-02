class CarouselImage < ApplicationRecord
  validates :image_url, presence: true
end
