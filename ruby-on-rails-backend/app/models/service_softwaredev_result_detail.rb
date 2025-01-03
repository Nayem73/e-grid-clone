class ServiceSoftwaredevResultDetail < ApplicationRecord
  belongs_to :service_softwaredev_result

  validates :locale, presence: true
end
