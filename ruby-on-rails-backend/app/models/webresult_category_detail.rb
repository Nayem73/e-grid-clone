class WebresultCategoryDetail < ApplicationRecord
  belongs_to :webresult_category
  validates :locale, :company_name, :service_name, presence: true
end