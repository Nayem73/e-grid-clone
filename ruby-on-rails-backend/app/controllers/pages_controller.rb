class PagesController < ApplicationController
  def index
    @pages = Page.all
    render json: @pages, include: { page_components: { include: :media } }
  end

  def show
    @page = Page.find(params[:id])
    render json: @page, include: { page_components: { include: :media } }
  end

  def create
    @page = Page.new(page_params)
    
    if @page.save
      render json: @page, status: :created
    else
      render json: @page.errors, status: :unprocessable_entity
    end
  end

  private

  def page_params
    params.require(:page).permit(
      :slug,
      :template_type,
      :title,
      :meta_description,
      :meta_keywords,
      :status
    )
  end
end