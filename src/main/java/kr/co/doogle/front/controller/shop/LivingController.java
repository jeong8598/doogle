package kr.co.doogle.front.controller.shop;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.doogle.mapper.CategoryMapper;
import kr.co.doogle.mapper.LivingMapper;
import kr.co.doogle.paging.Paging;

@Controller
public class LivingController {
	@Autowired
	private LivingMapper livingMapper;
	@Autowired
	private Paging paging;
	@Autowired
	private CategoryMapper categoryMapper;

	@RequestMapping("/shop/living")
	public String living(HttpSession session, HttpServletRequest request, Model model) {
		int mno = Integer.parseInt(session.getAttribute("mno").toString());
		
		int page = request.getParameter("page") != null ? Integer.parseInt(request.getParameter("page")) : 1;
		paging.setPaging(page, livingMapper.getTotal(mno), "/shop/living");	//늘사는것 상품수넣고 페이지세팅
		//한페이지 보여지는 행 수:10 , 페이지 표시 수:10으로 설정되어있음
		model.addAttribute("list", livingMapper.getAllPaging(paging.getStartRow(), paging.getViewCnt(), mno));
		model.addAttribute("url", "/shop/living");
		model.addAttribute("i", paging.getStartRow());
		model.addAttribute("paging", paging.getPageHtml());
		//type:카테고리타입 , lv:카테고리레벨, pctno:부모카테고리번호
		model.addAttribute("clist", categoryMapper.getAll("where type = #{type} and lv = #{lv}", "p", "0", null));
		
		return "/front/shop/living/living";
	}
	
	@RequestMapping("/shop/deleteLiving")
	public String deleteLiving(HttpServletRequest request, HttpSession session) {
		// int mno = 1;
		int mno = Integer.parseInt(session.getAttribute("mno").toString());
		String[] lnos = request.getParameterValues("lno");
		for (int i = 0; i < lnos.length; i++) {
			int lno = Integer.parseInt(lnos[i]);
			livingMapper.deleteLiving(mno, lno);
		}
		return "redirect:/shop/living";
	}

	@RequestMapping("/shop/deleteOneLiving")
	public String deleteOneLiving(HttpServletRequest request, HttpSession session) {
		//int mno = 1;
		int mno = Integer.parseInt(session.getAttribute("mno").toString());
		int lno = Integer.parseInt(request.getParameter("lno"));
		livingMapper.deleteLiving(mno, lno);
		return "redirect:/shop/living";
	}

	/* 모달로 늘사는것 리스트 추가 ---상품상세페이지 */
	@RequestMapping("/shop/putOnLiving")
	@Transactional(timeout = 10)
	public void putOnLiving(HttpServletRequest request, PrintWriter out, HttpSession session) {
		int mno = session.getAttribute("mno") != null ? Integer.parseInt(session.getAttribute("mno").toString()) : 0;
		int pno = Integer.parseInt(request.getParameter("pno"));
		int countNum = livingMapper.isOnTheList(mno, pno);
		
		if (countNum == 0) {
			int cnt = livingMapper.addLiving(mno, pno);
			out.print(cnt);
		} else {
			out.print(0);			
		}
	}
}
