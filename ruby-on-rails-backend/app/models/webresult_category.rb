class WebresultCategory < ApplicationRecord
  has_many :webresult_category_details, dependent: :destroy
  accepts_nested_attributes_for :webresult_category_details, allow_destroy: true
  
  before_create :set_position
  
  private
  
  def set_position
    self.position = (self.class.maximum(:position) || 0) + 1
  end
end