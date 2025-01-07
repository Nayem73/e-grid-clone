class WebresultCategoryDetail < ApplicationRecord
  belongs_to :webresult_category
  validates :locale, :company_name, :service_name, presence: true
  
  before_create :set_position
  
  private
  
  def set_position
    last_position = webresult_category.webresult_category_details.maximum(:position) || 0
    self.position = last_position + 1
  end
end
