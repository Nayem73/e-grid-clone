class WebresultCategory < ApplicationRecord
  has_many :webresult_category_details, -> { order(position: :asc) }, dependent: :destroy
  accepts_nested_attributes_for :webresult_category_details, allow_destroy: true
end
