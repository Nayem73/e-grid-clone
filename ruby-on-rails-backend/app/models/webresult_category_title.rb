class WebresultCategoryTitle < ApplicationRecord
  validates :title_en, presence: true
  validates :title_jp, presence: true
end
