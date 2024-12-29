class PageComponentsController < ApplicationController
  def create
    @page_component = PageComponent.new(page_component_params)
    
    if @page_component.save
      render json: @page_component, status: :created
    else
      render json: @page_component.errors, status: :unprocessable_entity
    end
  end

  def update
    @page_component = PageComponent.find(params[:id])
    if @page_component.update(page_component_params)
      render json: @page_component
    else
      render json: @page_component.errors, status: :unprocessable_entity
    end
  end

  private

  def page_component_params
    params.require(:page_component).permit(
      :page_id,
      :component_type,
      :position,
      content: {},
      style_settings: {},
      media_ids: []
    )
  end
end