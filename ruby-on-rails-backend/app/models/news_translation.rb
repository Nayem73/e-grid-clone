class NewsTranslation < ApplicationRecord
  belongs_to :news

  validates :locale, presence: true
  validates :title, presence: true
  validates :description, presence: true
  validates :image_url, presence: true
end
