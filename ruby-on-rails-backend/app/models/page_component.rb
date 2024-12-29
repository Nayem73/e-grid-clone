class PageComponent < ApplicationRecord
  belongs_to :page
  has_many :component_media
  has_many :media, through: :component_media
end
