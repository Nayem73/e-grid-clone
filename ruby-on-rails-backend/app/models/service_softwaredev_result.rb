class ServiceSoftwaredevResult < ApplicationRecord
  has_many :service_softwaredev_result_details, dependent: :destroy
  accepts_nested_attributes_for :service_softwaredev_result_details
end
